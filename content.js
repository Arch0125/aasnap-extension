const scriptContent = `
  function checkEthereum() {
    if (window.ethereum) {
      const originalRequest = window.ethereum.request;
      window.ethereum = new Proxy(window.ethereum, {
        get(target, property) {
          if (property === 'request') {
            return async function (request) {
              if (request.method === 'eth_requestAccounts') {
                window.postMessage({ type: 'ETHEREUM_PROVIDER', text: 'Intercepted eth_requestAccounts' }, '*');
                const defaultSnapOrigin = 'local:http://localhost:8080';
                const res = await ethereum.request({
                  method: "wallet_invokeSnap",
                  params: {
                    snapId: defaultSnapOrigin,
                    request: { method: 'hello' },
                  },
                });
                console.log(res);
                if(res==true){
                return["0x4db171FeB51160AFE95BB39f263c3BC53f17a7Df"]}
              }
              return originalRequest.apply(this, arguments);
            }
          }
          return target[property];
        }
      });
    } else {
      setTimeout(checkEthereum, 100);
    }
  }
  checkEthereum();
`;

// Create a script tag with the above script content
const scriptElement = document.createElement('script');
scriptElement.textContent = scriptContent;
(document.head||document.documentElement).appendChild(scriptElement);
scriptElement.remove(); // Once the script is injected, remove the element.

window.addEventListener('message', function(event) {
  // We only accept messages from ourselves
  if (event.source !== window) return;
  if (event.data.type && (event.data.type === 'ETHEREUM_PROVIDER')) {
    console.log(event.data.text);
    alert(event.data.text);
  }
});
