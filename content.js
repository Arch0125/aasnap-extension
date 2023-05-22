const ethersScript = document.createElement("script");
ethersScript.src = "https://cdn.ethers.io/lib/ethers-5.0.umd.min.js"; // Ethers.js CDN
(document.head || document.documentElement).appendChild(ethersScript);

ethersScript.onload = () => {
  const scriptContent = `
  //5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82

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
                  const privateKey = '5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82';
                  const wallet = new window.ethers.Wallet(privateKey);
                  console.log('Address: ', wallet.address);
                  return[wallet.address]
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
