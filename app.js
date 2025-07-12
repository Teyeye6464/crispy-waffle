// Подключение MetaMask
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        document.getElementById('status').innerText = 'MetaMask не установлен!';
        return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    document.getElementById('status').innerText = `Подключен кошелек: ${account}`;
    document.getElementById('transactionForm').style.display = 'block';
}

// Вызов Approve
async function approveTokens() {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const spenderAddress = document.getElementById('spenderAddress').value;
    const amount = document.getElementById('amount').value;

    if (!tokenAddress || !spenderAddress || !amount) {
        document.getElementById('status').innerText = 'Заполните все поля!';
        return;
    }

    const abi = [
        {
            "constant": false,
            "inputs": [
                {"name":"_spender","type":"address"},
                {"name":"_value","type":"uint256"}
            ],
            "name":"approve",
            "outputs": [{"name":"","type":"bool"}],
            "type":"function"
        }
    ];

    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(abi, tokenAddress);

    const amountInWei = web3.utils.toWei(amount.toString(), 'ether'); // Учитывайте decimals токена

    tokenContract.methods.approve(spenderAddress, amountInWei).send({ from: ethereum.selectedAddress })
        .on('transactionHash', (hash) => {
            document.getElementById('status').innerText = `Транзакция отправлена: ${hash}`;
        })
        .on('receipt', (receipt) => {
            document.getElementById('status').innerText = 'Транзакция подтверждена!';
        })
        .on('error', (error) => {
            document.getElementById('status').innerText = `Ошибка: ${error.message}`;
        });
}

// Назначение обработчиков событий
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('approveButton').addEventListener('click', approveTokens);
              
