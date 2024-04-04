<script lang="ts">
    import type { PageData } from './$types';
    import { loginSchema } from '$lib/utils/schemas';
    import TextField from '$lib/components/Forms/TextField.svelte';
    import SuperForm from '$lib/components/Forms/Form.svelte';
    import * as m from '$paraglide/messages.js';
	import FoxgloveLogo from '$lib/assets/foxglove.png';

    export let data: PageData;
</script>

<div class="flex items-center justify-center h-screen bg-slate-200">
    <div class="w-full max-w-lg p-10 rounded-lg shadow-lg bg-white">
        <!-- <div class="bg-primary-50 px-2 py-5 rounded-full text-3xl text-center">
            <i class="fa-solid fa-right-to-bracket" />
        </div> -->
		<img class="mx-auto mb-5" height="300" width="300" src={FoxgloveLogo} alt="Logo" />
        <h3 class="font-bold text-2xl text-gray-900 text-center my-4">
            {m.logIntoYourAccount()}
        </h3>
        <p class="text-center text-gray-600 text-sm mb-4">
            {m.youNeedToLogIn()}
        </p>
        <!-- SuperForm with dataType 'form' -->
        <SuperForm
            class="flex flex-col space-y-3"
            data={data?.form}
            dataType="form"
            let:form
            validators={loginSchema}
        >
            <TextField type="email" {form} field="username" label={m.email()} />
            <TextField type="password" {form} field="password" label={m.password()} />
            <div class="flex justify-end">
                <a
                    href="/password-reset"
                    class="text-primary-800 hover:text-primary-600"
                    data-testid="forgot-password-btn"
                >
                    {m.forgtPassword()}?
                </a>
            </div>
            <button class="btn variant-filled-success font-semibold w-full" data-testid="login-btn" type="submit">
                {m.login()}
            </button>
        </SuperForm>
    </div>
</div>
