class HTTPError extends Error {
    code;
    constructor(response) {
        super(response.statusText);
        this.code = response.status;
    }
}
const jsonType = "application/json";
export class NoteApi {
    url;
    apiKey;
    constructor(url, apiKey) {
        this.url = url;
        this.apiKey = apiKey;
    }
    async fetch(method, body) {
        const options = {
            method,
            mode: "cors",
            credentials: "omit",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                Accept: jsonType,
                "Content-Type": jsonType,
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(this.url, options);
        if (!response.ok) {
            throw new HTTPError(response);
        }
        if (response.status !== 204) {
            return response.json();
        }
    }
    create(body) {
        return this.fetch("POST", body);
    }
    read() {
        return this.fetch("GET");
    }
    update(body) {
        return this.fetch("PATCH", body);
    }
    delete(id) {
        return this.fetch("DELETE", { id });
    }
}
//# sourceMappingURL=api.js.map