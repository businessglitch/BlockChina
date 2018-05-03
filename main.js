const SHA256 = require('crypto-js/sha256');

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
		this.difficulty = 5;
	}

	createGenesisBlock() {
		return new Block("01/01/1990", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
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
/*console.log("Mining Block 1...")
blockChina.addBlock(new Block(1,"02/05/2018", {amount: 400, Buyer: "Fahad"}))
console.log("Mining Block 2...")
blockChina.addBlock(new Block(2,"02/05/2018", {amount: 200, Buyer: "Hayat"}))*/

console.log("is Chain Valid", blockChina.isChainValid());