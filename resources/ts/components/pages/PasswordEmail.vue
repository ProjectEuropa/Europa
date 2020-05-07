<template>
  <v-content>
    <v-container>
      <v-layout row class="text-xs-center">
        <v-flex class="grey lighten-4">
          <v-container style class="text-xs-center">
            <v-card flat>
              <v-card-title primary-title>
                <h4>Password Reset Email</h4>
              </v-card-title>
              <ValidationObserver ref="observer">
                <v-form method="POST" action="/password/email" id="password-email">
                  <input type="hidden" name="_token" :value="csrf" />

                  <v-col cols="12" md="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="メールアドレス"
                      rules="required|max:100|email"
                    >
                      <v-text-field
                        prepend-icon="mdi-email"
                        v-model="email"
                        name="email"
                        :counter="100"
                        :error-messages="errors"
                        label="メールアドレス"
                        required
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-card-actions>
                    <v-btn
                      primary
                      large
                      block
                      class="primary"
                      @click="send()"
                    >Password Reset Email Send</v-btn>
                  </v-card-actions>
                </v-form>
              </ValidationObserver>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ValidationObserver } from "vee-validate";

@Component
export default class PasswordEmail extends Vue {
  email: string = "";
  csrf: string | null = document
    .querySelector('meta[name="csrf-token"]')!
    .getAttribute("content");

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  public async send() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      (<HTMLFormElement>document.querySelector("#password-email")).submit();
    }
  }
}
</script>
