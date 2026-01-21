import axios from "axios";

const commonApi = axios.create({
    baseURL: "https://rahna.pythonanywhere.com/api/",
});

commonApi.interceptors.request.use(
    (config) => {
        const userJson = localStorage.getItem("user");

        if (userJson) {
            try {
                const userData = JSON.parse(userJson);
                let token = userData.token; 

                if (token) {
                    // Clean the token (removing any accidental quotes)
                    token = token.replace(/^"(.*)"$/, '$1').replace(/['"]+/g, '');
                    config.headers.Authorization = `Bearer ${token}`;
                    
                    // We removed the success log to keep the console clean
                }
            } catch (err) {
                console.error("Auth Token Error:", err);
            }
        }
        // Notice we removed the 'else' console.warn here to keep things quiet!
        return config;
    },
    (error) => Promise.reject(error)
);

commonApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect if the error is 401 AND we are trying to access a private route
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("user");
            // Only redirect if we aren't already on the login/register pages
            if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
                window.location.href = "/login"; 
            }
        }
        return Promise.reject(error);
    }
);

export default commonApi;