<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Socialite;
use Auth;
use App\SocialAccount;

class SocialController extends Controller {
    /*
      |--------------------------------------------------------------------------
      | Registration & Login Controller
      |--------------------------------------------------------------------------
      |
      | This controller handles the registration of new users, as well as the
      | authentication of existing users. By default, this controller uses
      | a simple trait to add these behaviors. Why don't you explore it?
      |
     */

use AuthenticatesAndRegistersUsers,
    ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware($this->guestMiddleware(), ['except' => 'logout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data) {
        return Validator::make($data, [
                    'name' => 'required|max:255',
                    'email' => 'required|email|max:255|unique:users',
                    'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data) {
        return User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => bcrypt($data['password']),
        ]);
    }

    // twitter
    public function getTwitterAuth() {
        return Socialite::driver('twitter')->redirect();
    }

    public function getTwitterAuthCallback() {
        $twitterUser = Socialite::driver('twitter')->user();

        $user = $this->findOrCreateUser($twitterUser, 'twitter');
        Auth::login($user, true);

        return redirect($this->redirectTo);
    }

    // Google
    public function getGoogleAuth() {
        return Socialite::driver('google')->redirect();
    }

    public function getGoogleAuthCallback() {
        $googleUser = Socialite::driver('google')->user();

        $user = $this->findOrCreateUser($googleUser, 'google');
        Auth::login($user, true);

        return redirect($this->redirectTo);
    }

    /**
     * Return user if exists; create and return if doesn't
     *
     * @param $providerUser
     * @return User
     */
    private function findOrCreateUser($providerUser, $provider) {
        $authUser = User::where('provider_id', $providerUser->getId())->first();

        if ($authUser) {
            return $authUser;
        }

        return User::create([
                    'name' => $providerUser->getName(),
                    'provider_id' => $providerUser->getId(),
                    'email'  => $providerUser->getEmail(),
                    'avatar' => $providerUser->getAvatar(),
                    'provider' => $provider
        ]);
    }

}
