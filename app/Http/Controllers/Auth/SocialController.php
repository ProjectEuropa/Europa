<?php
namespace App\Http\Controllers\Auth;
use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Socialite;
use Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class SocialController extends Controller {

    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
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