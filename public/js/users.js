const user=[];
const addUser=({id,username,room})=>{
      user.push({id,username,room});
      return user;
}
const getUser=(id)=>{
    const index=user.findIndex((user)=> {return user.id===id })
    if(index!==-1){
       return user[index];
    }
    else
    return {
        error:'user Not Exist'
    }
}
const removeUser=(id)=>{
    const index=user.findIndex((user)=> {return user.id==id })
  //  console.log(index);
    if(index!==-1){
       return user.splice(index,1);
    }
    else
    return {
        error:'user Not Exist'
    }
}
const getUserByRoom=(room)=>{
    const users=user.filter((user)=> {return user.room==room })
    return users;

}
module.exports={
    addUser,
    getUser,
    removeUser,
    getUserByRoom,
    user
}
