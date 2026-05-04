import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { reducer } from './Reducer';
import Cookies from 'js-cookie';

export const GlobalContext = createContext();

const savedUser = localStorage.getItem('fieldops_user');
const savedToken = Cookies.get('fieldops_token') || localStorage.getItem('fieldops_token');
let data = {
    // Local storage se user ka data uthana
    user: (savedUser && savedUser !== "undefined") ? JSON.parse(savedUser) : null,    // Token check karne ke liye cookie ya localstorage dono dekhein
    token: savedToken || null,
    isLogin: !!savedToken,
    jobs: [],
    loading: false,
    baseUrl: 'http://localhost:5000/api'
}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data);

    // Jab bhi state change ho, hum sync kar sakte hain (Optional)
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('fieldops_user', JSON.stringify(state.user));
        }
        if (state.token) {
            // Cookie mein save karna (7 din ke liye)
            Cookies.set('fieldops_token', state.token, { expires: 7 });
            localStorage.setItem('fieldops_token', state.token);
        }
    }, [state.user, state.token]);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useAuth must be used within a ContextProvider");
    }
    return context;
};