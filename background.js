chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.method === "POST" && details.requestBody) {
        const decoder = new TextDecoder("utf-8");
        const requestData = JSON.parse(decoder.decode(details.requestBody.raw[0].bytes));
  
        // Check if the request is an Ethereum JSON-RPC call
        if (requestData.jsonrpc === "2.0" && requestData.method.startsWith("eth_")) {
          // Log the intercepted Ethereum RPC call
          console.log(`Intercepted Ethereum RPC call:\n\n${JSON.stringify(requestData, null, 2)}`);
        }
      }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestBody"]
  );
  