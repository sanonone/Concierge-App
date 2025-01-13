import { useState, useEffect } from "react"

function Example(){
    const [count, setCount] = useState(0)
    
//    const handleClick = () =>{
//        setCount(count + 1)
//        document.title = `Conteggio : ${count}`
//    }

    return(
        <div>
            <p>Conteggio: {count}</p>
            <button className=" p-3 rounded-md hover:bg-slate-400 bg-slate-800" onClick={()=>setCount(count + 1)}>Incrementa</button>
        </div>
    )

}
export default Example;