const ethersScript = document.createElement("script");
ethersScript.src = "https://cdn.ethers.io/lib/ethers-5.0.umd.min.js"; // Ethers.js CDN
(document.head || document.documentElement).appendChild(ethersScript);

ethersScript.onload = () => {
  const scriptContent = `

function checkEthereum() {
    if (window.ethereum) {
      const originalRequest = window.ethereum.request;
      window.ethereum = new Proxy(window.ethereum, {
        get(target, property) {
          if (property === 'request') {
            return async function (request) {
              if(request.method === 'eth_sendTransaction') {
                window.postMessage({ type: 'ETHEREUM_PROVIDER', text: 'Intercepted eth_sendTransaction' }, '*');
                alert('Intercepted eth_sendTransaction');
                console.log("Transaction Details : ",request.params[0]);
                const txobject = request.params[0];
                const hash = await ethereum.request({
                  method: "wallet_invokeSnap",
                  params: {
                    snapId: "local:http://localhost:8080",
                    request: { method: 'sendtx', params: {to:txobject.to, value:txobject.value, data:txobject.data} },
                  },
                });
                console.log("Transaction Hash : ",hash);
                return hash;
              }
              if (request.method === 'eth_requestAccounts') {
                let snapexists = await window.ethereum.request({
                  method: 'wallet_getSnaps',
                })
                console.log(snapexists);
                const key = Object.keys(snapexists);
                if(key.length === 0){
                  confirm("Snap is not installed");
                  const snapId = 'local:http://localhost:8080';
                  const params = {};
                  await window.ethereum.request({
                    method: 'wallet_requestSnaps',
                    params: {
                      [snapId]: params,
                    },
                  });
                }
                else{
                  alert("Snap is installed");
                }
                window.postMessage({ type: 'ETHEREUM_PROVIDER', text: 'Intercepted eth_requestAccounts' }, '*');
                const defaultSnapOrigin = 'local:http://localhost:8080';
                const res = await ethereum.request({
                  method: "wallet_invokeSnap",
                  params: {
                    snapId: defaultSnapOrigin,
                    request: { method: 'aainit' },
                  },
                });
                console.log(res);
                if(res){
                const address = res;
                return [address];
              }
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
  const scriptElement = document.createElement("script");
  scriptElement.textContent = scriptContent;
  (document.head || document.documentElement).appendChild(scriptElement);
  scriptElement.remove(); // Once the script is injected, remove the element.
};

window.addEventListener("message", function (event) {
  // We only accept messages from ourselves
  if (event.source !== window) return;
  if (event.data.type && event.data.type === "ETHEREUM_PROVIDER") {
    console.log(event.data.text);
    alert(event.data.text);
  }
});
