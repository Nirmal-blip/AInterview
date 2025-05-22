import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();
export const useAuthContext = () => {
    return useContext(AuthContext);
}
export const AuthContextProvider = ({ children }) => {
    const [Authuser, setAuthuser] = useState(JSON.parse(localStorage.getItem("company-admin")) || null);
    const [AuthInterviewee, setAuthInterviewee] = useState(JSON.parse(localStorage.getItem("company-interviewee")) || null);
    return <AuthContext.Provider value={{ Authuser, setAuthuser, AuthInterviewee, setAuthInterviewee }}>
        {children}
    </AuthContext.Provider>
}