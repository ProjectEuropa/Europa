<template>
  <v-content>
    <v-container>
      <v-layout row class="text-xs-center">
        <v-flex class="grey lighten-4">
          <v-container style class="text-xs-center">
            <v-card flat>
              <v-card-title primary-title>
                <h4>Register</h4>
              </v-card-title>
              <ValidationObserver ref="observer">
                <v-form method="POST" action="/register" id="register">
                  <input type="hidden" name="_token" :value="csrf" />

                  <v-col cols="12" md="12">
                    <ValidationProvider v-slot="{ errors }" name="名前" rules="required|max:100">
                      <v-text-field
                        prepend-icon="mdi-account-circle"
                        v-model="name"
                        name="name"
                        :counter="100"
                        :error-messages="errors"
                        label="名前"
                        required
                      ></v-text-field>
                    </ValidationProvider>
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
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="パスワード"
                      rules="required|max:100|min:8|confirmed:password_confirmation"
                    >
                      <v-text-field
                        prepend-icon="mdi-lock"
                        v-model="password"
                        name="password"
                        :counter="100"
                        :error-messages="errors"
                        type="password"
                        label="パスワード"
                        required
                      ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="パスワード再確認"
                      vid="password_confirmation"
                      rules="required|max:100|min:8"
                    >
                      <v-text-field
                        prepend-icon="mdi-lock"
                        v-model="password_confirmation"
                        :counter="100"
                        name="password_confirmation"
                        :error-messages="errors"
                        type="password"
                        label="パスワード再確認"
                        required
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-card-actions>
                    <v-btn primary large block class="primary" @click="register()">Register</v-btn>
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
export default class Login extends Vue {
  name: string = "";
  email: string = "";
  password: string = "";
  password_confirmation = "";
  csrf: string | null = document
    .querySelector('meta[name="csrf-token"]')!
    .getAttribute("content");

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  public async register() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      (<HTMLFormElement>document.querySelector("#register")).submit();
    }
  }
}
</script>
