const scriptContent = `
  function checkEthereum() {
    if (window.ethereum) {
      const originalRequest = window.ethereum.request;
      window.ethereum.request = async function (request) {
        if (request.method === 'eth_requestAccounts') {
          window.postMessage({ type: 'ETHEREUM_PROVIDER', text: 'Intercepted ' + request.method }, '*');
        }
        if (request.method === 'eth_sendTransaction') {
          window.postMessage({ type: 'ETHEREUM_PROVIDER', text: 'Intercepted ' + request.method }, '*');
          console.log(request.params[0]); // Log the transaction object
        }
        return originalRequest.apply(this, arguments);
      };
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
