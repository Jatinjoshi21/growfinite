import hashlib
import json
import time
from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

# Simple Blockchain Structure
class Blockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.wallets = {}  # Store user balances
        self.create_block(proof=1, previous_hash='0')  # Genesis block

    def create_block(self, proof, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time.time(),
            'transactions': self.pending_transactions,
            'proof': proof,
            'previous_hash': previous_hash
        }
        self.pending_transactions = []
        self.chain.append(block)
        return block

    def add_transaction(self, sender, receiver, amount):
        if sender not in self.wallets or self.wallets[sender] < amount:
            return False  # Insufficient balance
        
        transaction = {
            'sender': sender,
            'receiver': receiver,
            'amount': amount
        }
        self.pending_transactions.append(transaction)
        self.wallets[sender] -= amount
        self.wallets[receiver] = self.wallets.get(receiver, 0) + amount
        return self.last_block['index'] + 1

    def proof_of_work(self, previous_proof):
        new_proof = 1
        while hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()[:4] != '0000':
            new_proof += 1
        return new_proof

    def hash(self, block):
        return hashlib.sha256(json.dumps(block, sort_keys=True).encode()).hexdigest()

    @property
    def last_block(self):
        return self.chain[-1]

blockchain = Blockchain()

# User authentication system (Login with Private Key)
users = {}

def create_wallet():
    private_key = hashlib.sha256(str(time.time()).encode()).hexdigest()
    public_key = hashlib.sha256(private_key.encode()).hexdigest()
    users[public_key] = private_key
    blockchain.wallets[public_key] = 100  # Give some starting balance
    return private_key, public_key

@app.route('/register', methods=['GET'])
def register():
    private_key, public_key = create_wallet()
    return jsonify({'private_key': private_key, 'public_key': public_key}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    private_key = data.get('private_key')
    
    if not private_key:
        return jsonify({'message': 'Private key required'}), 400
    
    for pub_key, priv_key in users.items():
        if priv_key == private_key:
            return jsonify({'message': 'Login successful', 'public_key': pub_key}), 200
    
    return jsonify({'message': 'Invalid private key'}), 401

@app.route('/transaction/new', methods=['POST'])
def new_transaction():
    data = request.json
    sender = data.get('sender')
    receiver = data.get('receiver')
    amount = data.get('amount')

    if not sender or not receiver or not amount:
        return jsonify({'message': 'Missing data'}), 400
    
    if blockchain.add_transaction(sender, receiver, amount):
        return jsonify({'message': f'Transaction added'}), 201
    else:
        return jsonify({'message': 'Insufficient balance'}), 400

@app.route('/mine', methods=['GET'])
def mine():
    previous_block = blockchain.last_block
    proof = blockchain.proof_of_work(previous_block['proof'])
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof, previous_hash)
    return jsonify(block), 200

@app.route('/chain', methods=['GET'])
def full_chain():
    return jsonify({'chain': blockchain.chain}), 200

if __name__ == '__main__':
    app.run(debug=True)
