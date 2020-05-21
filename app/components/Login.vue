<template lang="html">
    <Page @loaded="checkToken" class="page">
        <ActionBar title="Login" />
        <StackLayout class="form">
            <Label class="header" text="Permit Scanner" />
            <StackLayout class="input-field" marginBottom="25">
                <TextField class="input" v-model="email" hint="Email Address" keyboardType="email" autocorrect="false" 
                autocapitalizationType="none" returnKeyType="next" fontSize="18"/>
                <StackLayout class="hr-light" />
            </StackLayout>
            <StackLayout class="input-field" marginBottom="25">
                <TextField class="input" v-model="password" hint="Password" secure="true" returnKeyType="done" fontSize="18"/>
                <StackLayout class="hr-light" />
            </StackLayout>
            <Button text="Login" @tap="login" class="btn btn-primary m-t-20"  fontSize="18" />
        </StackLayout>
    </Page>
</template>

<script>
import App from "./App";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    checkToken() {
      this.$store.dispatch("loadFromStorage");

      if (this.$store.state.token) {
        this.$navigateTo(App, {
          clearHistory: true
        });
      }
    },
    
    async login() {
      const formData = new FormData();
      const params = {
        grant_type: "password",
        client_id: "2",
        client_secret: "A2oOvVQ2ApU1FOIJKvsZUhbeD7O85yQCoMT0ZFCE",
        username: this.email,
        password: this.password,
        scope: "*"
      };

      for (const name in params) {
        formData.append(name, params[name]);
      }

      fetch("https://permits.centrisign.co.ke/oauth/token", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      }).then(function(response) {
         if (!response.ok) {
              alert({
                  title: "Authentication failed ",
                  message: "Invalid email/password",
                  okButtonText: "OK"
              });
          } else {
              return response;
          }
      })
        .then(response => response.json())
        .then(data => {
          this.$store.dispatch("setUser", data.access_token).then(() => {
            this.$navigateTo(App, {
              clearHistory: true
            });
          });
        }).catch(error => console.error("Error:", error));
    }
  }
};
</script>

<style scoped>
	.page {
		align-items: center;
		flex-direction: column;
	}

    .header {
		horizontal-align: center;
		font-size: 25;
		font-weight: 600;
		margin-bottom: 70;
		text-align: center;
		color: #53ba82;
	}

	.form {
		margin-left: 20;
		margin-right: 20;
		flex-grow: 2;
		vertical-align: middle;
	}

	.input-field {
		margin-bottom: 25;
	}

	.input {
		font-size: 18;
		placeholder-color: #A8A8A8;
	}

	.input-field .input {
		font-size: 54;
	}

	.btn-primary {
		height: 50;
		margin: 30 5 15 5;
		background-color: #53ba82;
        color: #ffffff;
		border-radius: 5;
		font-size: 20;
		font-weight: 600;
	}

	.bold {
		color: #000000;
	}
</style>
