import { HttpResponse, Http as nsHttp } from "@nativescript/core";
import Requester = Http.Requester;

const packageJson = require("./package.json");

export class TNSRequester implements Requester {
  request(verb: Http.Verb, url: string, callback: Callback<Http.Response>): void;
  request(verb: Http.Verb, url: string, requestBody: string, callback: Callback<Http.Response>): void;
  request(verb: Http.Verb, url: string, requestBody, callback?: Callback<Http.Response>): void {
    if (typeof requestBody === "function") {
      callback = requestBody;
      requestBody = null;
    }

    if (requestBody && typeof requestBody === "object") {
      requestBody = JSON.stringify(requestBody);
    }

    nsHttp.request({
      method: TNSRequester.getHttpMethodName(verb),
      url,
      content: requestBody,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-NativeScript-AppSync-Plugin-Name": packageJson.name,
        "X-NativeScript-AppSync-Plugin-Version": packageJson.version,
        "X-NativeScript-AppSync-SDK-Version": packageJson.dependencies["nativescript-app-sync-cli"]
      }
    }).then((response: HttpResponse) => {
      callback(null, {
        statusCode: response.statusCode,
        body: response.content ? response.content.toString() : null
      });
    });
  }

  private static getHttpMethodName(verb): string {
    // This should stay in sync with the enum at
    // https://github.com/Microsoft/code-push/blob/master/sdk/script/acquisition-sdk.ts#L6
    return [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE",
      "TRACE",
      "OPTIONS",
      "CONNECT",
      "PATCH"
    ][verb];
  }
}