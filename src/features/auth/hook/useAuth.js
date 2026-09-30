import { useDispatch, useSelector } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    async function handleRegister({ email, username, password }) {
        dispatch(setError(null));
        try {
            dispatch(setLoading(true));
            const data = await register({ email, username, password });
            return data;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registration failed"));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setError(null));
        try {
            dispatch(setLoading(true));
            const data = await login({ email, password });
            dispatch(setUser(data.user));
            return data;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        dispatch(setError(null));
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
            return data;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch user"));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    function clearError() {
        dispatch(setError(null));
    }

    return {
        user,
        loading,
        error,
        handleRegister,
        handleLogin,
        handleGetMe,
        clearError
    }
}
