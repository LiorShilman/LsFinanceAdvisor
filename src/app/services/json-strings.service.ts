import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonStringsService {

  // Function to merge multiple JSON strings into one uniform JSON object
  MergeJsonStrings(jsonStrings: Record<string, string>): string {
    // Initialize an empty object to store merged JSON
    const mergedJson: Record<string, any> = {};

    // Iterate through the input JSON strings
    for (const key in jsonStrings) {
      if (jsonStrings.hasOwnProperty(key)) {
        try {
          // Parse the JSON string for each key
          const parsedJson = JSON.parse(jsonStrings[key]);

          // Add the parsed JSON to the merged object with the key
          mergedJson[key] = parsedJson;
        } catch (error: any) { // Specify the type of 'error' as 'any'
          console.error(`Error parsing JSON for key '${key}': ${error.message}`);
        }
      }
    }

    // Convert the merged object back to a JSON string
    const mergedJsonString = JSON.stringify(mergedJson);

    return mergedJsonString;
  }

     MergeJsonStringsMJ(jsonStrings: Record<string, string>): string {
      // Initialize an empty object to store merged JSON
      const mergedJson: Record<string, any> = {};
  
      // Iterate through the input JSON strings
      for (const key in jsonStrings) {
        if (jsonStrings.hasOwnProperty(key)) {
          try {
            // Parse the JSON string for each key
            const parsedJson = JSON.parse(jsonStrings[key]);
  
            // Check if the parsed JSON is an object
            if (typeof parsedJson === "object" && parsedJson !== null) {
              // Recursively merge inner JSON objects
              mergedJson[key] = this.MergeInnerJson(parsedJson);
            } else {
              mergedJson[key] = parsedJson;
            }
          } catch (error: any) {
            console.error(`Error parsing JSON for key '${key}': ${error.message}`);
          }
        }
      }
  
      // Convert the merged object back to a JSON string
      const mergedJsonString = JSON.stringify(mergedJson);
  
      return mergedJsonString;
    }
  
    MergeInnerJson(json: any): any {
      if (typeof json !== "object" || json === null) {
        return json;
      }
  
      // Initialize an empty object to merge inner JSON
      const mergedJson: Record<string, any> = {};
  
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          // Recursively merge inner JSON objects
          mergedJson[key] = this.MergeInnerJson(json[key]);
        }
      }
  
      return mergedJson;
    } 

}
