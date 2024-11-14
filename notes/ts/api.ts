class HTTPError extends Error {
  readonly code: number;

  constructor(response: Response) {
    super(response.statusText);
    this.code = response.status;
  }
}

export interface Note {
  id: number;
  cat: string;
  content: string;
}

const jsonType = "application/json";

export class NoteApi {
  url: string;
  apiKey: string;

  constructor(url: string, apiKey: string) {
    this.url = url;
    this.apiKey = apiKey;
  }

  private async fetch(method: string, body?: object) {
    const options: RequestInit = {
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

  create(body: Omit<Note, "id">): Promise<Note> {
    return this.fetch("POST", body);
  }

  read(): Promise<Note[]> {
    return this.fetch("GET");
  }

  update(body: Omit<Note, "cat">): Promise<void> {
    return this.fetch("PATCH", body);
  }

  delete(id: number): Promise<void> {
    return this.fetch("DELETE", { id });
  }
}
