export class AuthService {

    getApiInfo() {
        return {
            message: "API online"
        };
    }
    
    getHealth() {
        return {
            status: "OK"
        };
    }
    
    getVersion() {
        return {
            version: "1.0.0"
        };
    }
    
    getAbout() {
        return {
            project: "API de Autenticação",
            author: "Yago Gigeck"
        };
    }
    
    getPing() {
        return {
            "pong": true
        };
    }

    getTime() {
        return {
            currentTime: new Date().toISOString()
        };
    };
};