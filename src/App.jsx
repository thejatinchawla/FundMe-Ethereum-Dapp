import {ethers} from "ethers"
import {contractAddress,abi} from "./abi/constants"
import {useState} from 'react'
import "./App.css"
function App() {
const [input, setinput] = useState("0.1")
const connect = async()=>{
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({method:"eth_requestAccounts"})
    document.getElementById("connect").innerHTML = "CONNECTED TO METAMASK"
    console.log("~~~~CONNECTED~~~~")
  } else {
    console.log("not hav metamask")
  }
}

const fund = async()=>{
  const ethAmmount = input
  console.log(`Funding with ${ethAmmount}`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress,abi,signer)
    try {
      const transcationResponse = await contract.fund({value: ethers.utils.parseEther(ethAmmount),})
      await txListen(transcationResponse,provider)
      console.log('~~~~FUNDED SUCCESSFULLY!~~~~')
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Please install MetaMask")
  }
}

const txListen = (transcationResponse,provider)=>{
  console.log(`mining......${transcationResponse.hash}`)
    return new Promise((resolve,reject)=>{
     provider.once(transcationResponse.hash,(transcationRecipt)=>{
      console.log(`completed with ${transcationRecipt.confirmations} confirmations`)
      resolve()
    })
  })
}

const balance = async() =>{
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(`${ethers.utils.formatEther(balance)} Ethereum`)
  }
}
    
async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await txListen(transactionResponse, provider)
      console.log("~~~~widthrawal successful~~~~")
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log("Please install MetaMask")
  }
}

    

  return (
    <div>
      <button id="connect" onClick={connect} >connect</button><br />
      <label htmlFor="fundAmmount">Enter the Amount : </label>
      <input id="fundAmmount" type="text" placeholder="min 0.1" value={input} onChange={(e)=>{setinput(e.target.value)}} />
      <button onClick={fund}>fund</button><br />
      <button onClick={balance}>Balance</button><br />
      <button onClick={withdraw}>Withdraw</button><br />
    </div>
  )
}

export default App
