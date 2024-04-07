// Global variables
let web3;
let registrationStatus, walletInfo, proceedBtn, signupBtn, loginBtn;

const contractAddress = "0x6CAf56d5017e93CE0cA565d85998615F4541df57";
const currentPath = window.location.pathname;

async function fetchABI() {
    const response = await fetch('/dist/js/abi.json');
    const abi = await response.json();
    return abi;
}

// Simplified and consolidated wallet connection logic
async function connectWallet() {
    if (!window.ethereum) {
        alert('Please install a compatible wallet!');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Wallet connected:', accounts[0]);
        modal.style.display = 'none'; // Assuming 'modal' is globally accessible
        updateUIOnConnection(accounts[0]);
        await checkUserRegistration(accounts[0]);
    } catch (error) {
        console.error('An error occurred during wallet connection:', error);
    }
}

// Update UI after successful connection
function updateUIOnConnection(account) {
    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('walletAddress').textContent = `Connected: ${account}`;
    document.getElementById('loginBtn').classList.add('hidden');
}

async function checkUserRegistration(address) {
    try {
        const networkId = await web3.eth.net.getId();
        if (networkId !== 56) {
            registrationStatus.textContent = 'Please switch your network to Binance Smart Chain.';
            return;
        }

        const abi = await fetchABI();
        const contract = new web3.eth.Contract(abi, contractAddress);
        const registered = await contract.methods.isUserRegistered(address).call();

        if (walletInfo) walletInfo.classList.remove('hidden');
        if (registrationStatus) document.getElementById('walletAddress').textContent = `Connected: ${address}`;

        if (registered) {
            if (registrationStatus) registrationStatus.textContent = 'Registered User';
            if (proceedBtn) proceedBtn.classList.remove('hidden');
            if (signupBtn) signupBtn.classList.add('hidden');
        } else {
            if (registrationStatus) registrationStatus.textContent = 'You are not registered.';
            if (proceedBtn) proceedBtn.classList.add('hidden');
            if (signupBtn) signupBtn.classList.remove('hidden');
        }
        if (loginBtn) loginBtn.classList.add('hidden');
    } catch (error) {
        console.error('Error checking user registration:', error);
        if (registrationStatus) registrationStatus.textContent = 'Error checking registration status. Please try again later.';
        if (proceedBtn) proceedBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
    }
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    registrationStatus = document.getElementById('registrationStatus');
    walletInfo = document.getElementById('walletInfo');
    proceedBtn = document.getElementById('proceedBtn');
    signupBtn = document.getElementById('signupBtn');
    loginBtn = document.getElementById('loginBtn');

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.on('accountsChanged', () => window.location.reload());
        checkIfWalletIsConnected();
    } else {
        alert('Wallet is not detected or locked. Please install MetaMask or use a browser with an Ethereum wallet.');
    }
});

async function checkIfWalletIsConnected() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        console.log('Wallet is connected:', accounts[0]);
        updateUIOnConnection(accounts[0]);
        await checkUserRegistration(accounts[0]);
    } else {
        console.log('No wallet connected.');
    }
}



// Logic for disconnecting the wallet
function disconnectWallet() {
    // Perform wallet disconnection logic if necessary

    // Hide wallet info and show login button
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('loginBtn').classList.remove('hidden');
}

function proceedToDashboard() {
    window.location.href = '/dashboard'; 
}

function proceedToRegister() {
    window.location.href = '/register'; 
}
