<template>
  <v-content>
    <v-container>
      <v-layout row class="text-xs-center">
        <v-flex class="grey lighten-4">
          <v-container style class="text-xs-center">
            <v-card flat>
              <v-card-title primary-title>
                <h4>Login</h4>
              </v-card-title>
              <ValidationObserver ref="observer">
                <v-form method="POST" action="/login" id="login">
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
                    <ValidationProvider v-slot="{ errors }" name="パスワード" rules="required|max:100">
                      <v-text-field
                        prepend-icon="mdi-lock"
                        v-model="password"
                        name="password"
                        :counter="100"
                        :error-messages="errors"
                        label="パスワード"
                        type="password"
                        required
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-card-actions>
                    <v-btn primary large block class="primary" @click="login()">Login</v-btn>
                  </v-card-actions>
                </v-form>
              </ValidationObserver>
              <v-col cols="12" md="12">
                <v-card-title class="cyan" @click="twitterLogin()">
                  <v-icon large left>mdi-twitter</v-icon>
                  <span class="title font-weight-light">Login with Twitter</span>
                </v-card-title>
              </v-col>
              <v-col cols="12" md="12">
                <router-link to="/password/email">forget password</router-link>
              </v-col>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ValidationObserver } from "vee-validate";

@Component
export default class Login extends Vue {
  email: string = "";
  password: string = "";
  csrf: string | null = document
    .querySelector('meta[name="csrf-token"]')!
    .getAttribute("content");

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  public async login() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      (<HTMLFormElement>document.querySelector("#login")).submit();
    }
  }

  /**
   * name
   */
  public twitterLogin() {
    location.href = "/auth/twitter";
  }
}
</script>
