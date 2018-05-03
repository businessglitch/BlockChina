const SHA256 = require('crypto-js/sha256');

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, previousHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.naunce = 0;
	}

	calculateHash() {
		return SHA256(this.naunce + this.timestamp + this.previousHash + JSON.stringify(this.transactions)).toString();
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
			this.naunce ++;
			this.hash = this.calculateHash();
		}
		console.log("Block Mined", this.hash);
	}
}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransaction = [];
		this.reward = 100;
	}

	createGenesisBlock() {
		return new Block("01/01/1990", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

	/*addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
	}*/

/* Reward Address = the address to which the reward should be sent to */
	minePendingTransaction(rewardAddress) {
		let block = new Block(Date.now(), this.pendingTransaction);
		block.previousHash = this.getLatestBlock().hash;
		block.mineBlock(this.difficulty);
		console.log("Block successfully mined");
		this.chain.push(block);

		this.pendingTransaction = [new Transaction(null,rewardAddress, this.reward)]
	}

	createTransaction(transaction) {
		this.pendingTransaction.push(transaction)
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for (const block of this.chain) {
			for(const transaction of block.transactions){
				console.log("from address", transaction.fromAddress);
				console.log("to Address", transaction.toAddress);
				if(transaction.fromAddress === address) {
					balance -= transaction.amount; 
					
				}

				if(transaction.toAddress === address) {
					balance += transaction.amount; 
					//console.log("to Address", transaction.toAddress);
				}
			}	
		}
		return balance
	}
	isChainValid() {
		for( var i = 1;  i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if(currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
}


let blockChina = new Blockchain();
blockChina.createTransaction("address1", "address2", 100);
blockChina.createTransaction("address2", "address3", 50);
blockChina.createTransaction("address3", "address1", 50);
blockChina.createTransaction("address2", "address3", 100);

console.log("\n Starting the miner...");
blockChina.minePendingTransaction("fahad's-address");
console.log("\n Balance of Fahad is: ", blockChina.getBalanceOfAddress("fahad's-address"))

console.log("\n Starting the miner again...");
blockChina.minePendingTransaction("fahad's-address");
console.log("\n Balance of Fahad is: ", blockChina.getBalanceOfAddress("fahad's-address"))
console.log("\n Balance of address2 is: ", blockChina.getBalanceOfAddress("address3"));

console.log("is Chain Valid", blockChina.isChainValid());

/*console.log("Mining Block 1...")
blockChina.addBlock(new Block(1,"02/05/2018", {amount: 400, Buyer: "Fahad"}))
console.log("Mining Block 2...")
blockChina.addBlock(new Block(2,"02/05/2018", {amount: 200, Buyer: "Hayat"}))
console.log("is Chain Valid", blockChina.isChainValid());*/