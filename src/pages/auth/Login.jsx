import LoginRegisterForm from '../../components/LoginRegisterForm';

const LoginPage = ({ updateAuthState }) => {
    return <LoginRegisterForm mode="login" updateAuthState={updateAuthState} />;
};

export default LoginPage;