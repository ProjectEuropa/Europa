<template>
  <v-content>
    <v-container fluid class="d-flex">
      <v-col cols="12" md="12">
        <ValidationObserver ref="observer">
          <v-form
            method="POST"
            action="/eventNotice"
            id="store"
            ref="form"
            lazy-validation
            justify="center"
          >
            <input type="hidden" name="_token" :value="csrf" />
            <v-row align="center" justify="center">
              <v-card class="mx-auto">
                <v-card-title class="blue">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon>mdi-upload</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title class="headline white--text">イベント告知</v-list-item-title>
                      <v-list-item-subtitle
                        class="white--text"
                      >イベントの告知が可能です。ここで登録した内容はInformationに表示されます。</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-title>
                <v-col cols="12" md="12">
                  <ValidationProvider v-slot="{ errors }" name="イベント名" rules="required|max:100">
                    <v-text-field
                      prepend-icon="mdi-calendar-edit"
                      v-model="eventName"
                      :counter="100"
                      :error-messages="errors"
                      label="イベント名"
                      name="eventName"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="イベント詳細情報" rules="required|max:100">
                    <v-textarea
                      prepend-icon="mdi-comment-multiple-outline"
                      v-model="eventDetails"
                      :error-messages="errors"
                      label="イベント詳細情報"
                      name="eventDetails"
                      required
                    ></v-textarea>
                  </ValidationProvider>

                  <v-text-field
                    prepend-icon="mdi-google"
                    v-model="url"
                    :counter="100"
                    label="イベント参照URL"
                    name="eventReferenceUrl"
                    required
                  ></v-text-field>

                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="イベント受付期間締切日"
                        rules="required|max:10"
                      >
                        <v-text-field
                          :error-messages="errors"
                          prepend-icon="mdi-av-timer"
                          v-model="closeDay"
                          :counter="10"
                          label="イベント受付期間締切日"
                          name="eventClosingDay"
                          v-on="on"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      no-title
                      scrollable
                      locale="ja"
                      v-model="closeDay"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>

                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <ValidationProvider
                        v-slot="{ errors }"
                        name="イベント表示最終日"
                        rules="required|max:10"
                      >
                        <v-text-field
                          :error-messages="errors"
                          prepend-icon="mdi-lastpass"
                          v-model="displayDay"
                          :counter="10"
                          label="イベント表示最終日"
                          v-on="on"
                          name="eventDisplayingDay"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      no-title
                      scrollable
                      locale="ja"
                      v-model="displayDay"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>

                  <v-select
                    prepend-icon="mdi-help-circle"
                    :items="items"
                    v-model="itemDefault"
                    name="eventType"
                  ></v-select>
                </v-col>
                <v-card-actions class="justify-center">
                  <v-btn large block class="primary" @click="dialogOpen()">イベント情報登録</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-container>
    <confirm-event-notice-modal ref="dialog" :storeObj="storeObj"></confirm-event-notice-modal>
  </v-content>
</template>

<script lang="ts">
import { ScheduleObjectSynchronizedLaravelEvents } from "../../vue-data-entity/ScheduleDataObject";
import { SelectBoxTextValueObject } from "../../vue-data-entity/SelectBoxTextValueObject";
import { ValidationObserver } from "vee-validate";
import ConfirmEventNoticeModal from "../modules/ConfirmEventNoticeModal.vue";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    ConfirmEventNoticeModal
  }
})
export default class EventNotice extends Vue {
  items: Array<SelectBoxTextValueObject> = [
    {
      text: "大会",
      value: "1"
    },
    {
      text: "告知",
      value: "2"
    },
    {
      text: "その他",
      value: "3"
    }
  ];
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
    dialog: ConfirmEventNoticeModal;
  };
  storeObj: ScheduleObjectSynchronizedLaravelEvents = {
    name: "",
    event_name: "",
    event_details: "",
    start: "",
    url: "",
    event_closing_day: "",
    event_displaying_day: ""
  };

  public async dialogOpen() {
    const isValid = await this.$refs.observer.validate();
    this.storeObj.event_name = this.eventName;
    this.storeObj.event_details = this.eventDetails;
    this.storeObj.url = this.url;
    this.storeObj.event_closing_day = this.closeDay;
    this.storeObj.event_displaying_day = this.displayDay;
    if (isValid) {
      this.$refs.dialog.open();
    }
  }

  csrf: string | null = document
    .querySelector('meta[name="csrf-token"]')!
    .getAttribute("content");
  itemDefault: string = "1";
  eventName: string = "";
  eventDetails: string = "";
  url: string = "";
  closeDay: string = "";
  displayDay: string = "";
  menu: boolean = false;
  menu2: boolean = false;
  snackbar: boolean = false;
}
</script>
