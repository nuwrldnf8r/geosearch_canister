require('dotenv').config()
const { Actor, HttpAgent } = require('@dfinity/agent')
const bip39 = require('bip39')
const canisters = require('../canister_ids.json')
const {Secp256k1KeyIdentity} = require('@dfinity/identity-secp256k1')
const { Nat } = require('@dfinity/candid');
const GeoHash = require('ngeohash')
const fetch = require('isomorphic-fetch')
const idlFactory = ({ IDL }) => {
    return IDL.Service({
      'find' : IDL.Func([IDL.Text, IDL.Float64], [IDL.Vec(IDL.Text)], []),
      'index' : IDL.Func([IDL.Text, IDL.Text], [], []),
    });
};




const canisterId = canisters.geohash_backend.ic
console.log('a3shf-5eaaa-aaaaa-qaafa-cai')
const host = 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=aojlo-sqaaa-aaaak-afkxq-ca'
  

const getIdentity = async () => {
  const seed = process.env.AGENT_SEED
  
  return await Secp256k1KeyIdentity.fromSeedPhrase(seed)
}

const createActor = async () => {
  const identity = await getIdentity()
  console.log(identity.getPrincipal().toText())
  //const principal = getPrincipal(identity)
  //console.log('identity: ', principal.toText())
  try{
    let agent = new HttpAgent({fetch, host, identity})
    //agent.replaceIdentity(identity)
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
  } catch(e){
    return {error: e.message}
  }
}

const index = async (geohash, id) => {
  try{
    const actor = await createActor()    
    console.log('indexing')
    await actor.index(geohash, id)
    return {success:true}
    
  } catch(e){
    return {error: e.message}
  }
}

const find = async (geohash, distance) => {
  try{
    const actor = await createActor()    
    console.log('finding')
    let ret = await actor.find(geohash, distance)
    return ret
    
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const geohash = (x,y) => {
  return GeoHash.encode(x, y, 10)
}

const run = async () => {
  
    /*
    let pt1 = {geohash: geohash(-34.099050, 18.399995), id: 'Point5'}
    let ret = await index(pt1.geohash, pt1.id)
    console.log(ret)

    
    let pt2 = {geohash: geohash(-34.089275, 18.359075), id: 'Point6'}
    ret = await index(pt2.geohash, pt2.id)
    console.log(ret)
  
    

    let pt3 = {geohash: geohash(-34.052167, 18.378220),id: 'Point7 - Hout Bay'}
    ret = await index(pt3.geohash, pt3.id)
    console.log(ret)

   
   let pt4 = {geohash: geohash(-33.983004, 18.442157),id: 'Point8 - Kirstenbosch'}
   ret = await index(pt4.geohash, pt4.id)
   console.log(ret)
   */
  
    ret = await find(geohash(-34.099050, 18.399995),15)
    console.log(ret) 
    

    
    

}

run().then()

