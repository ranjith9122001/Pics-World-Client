import React from "react";
import '../bootstrap.min.css'
import '../css/home.css'
import {HashLoader} from 'react-spinners'
import {useState,useContext,useEffect} from 'react'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import { context } from "./Context"
import { NavigationBar } from "./Navbar"
import {GrLike} from 'react-icons/gr'
import {GrDislike} from 'react-icons/gr'
import {MdAddAPhoto} from 'react-icons/md'

export const View=()=>{
    const det=useContext(context)
    const post=det.viewdetails
    const [comments,setComments]=useState([])
    const [postcomment,setPostComment]=useState("")
    const [nocomments,setNoComments]=useState(false)
    const [likes,setLikes]=useState(false)
    const [likedusers,setLikedUsers]=useState([])
    const [likeid,setLikeId]=useState("")
    const [loading,setLoading]=useState(true)
    const [clickedlike,setClickedLike]=useState(false)
    const [totallikes,setTotalLikes]=useState(0)
    const navigate=useNavigate()
    
    useEffect(()=>{
        setTimeout(()=>{
            getcomments()
            checklike()
        },1000)
    },[])

    const getcomments=()=>{
        axios.get(`/comments/getcomments/${post._id}`).then((res)=>{
            if(res.data.status){
                setComments(res.data.msg)
                setNoComments(false)
            }
            else {
                setNoComments(true)
            }
        })
    }

    const addcomment=(e)=>{
        const datas={
            postid:post._id,
            username:det.username,
            useremail:det.useremail,
            comment:postcomment
        }
        axios.post("/comments/postcomments",datas).then((res)=>{
            if(res.data.status){
                getcomments()
                toast.success("Comment Added Successfully !")
            }
        })
        setPostComment("")
    }

    const deletecomment=(id)=>{
        axios.delete(`/comments/deletecomment/${id}`).then((res)=>{
                getcomments()
                toast.success("Comment Deleted successfully !")
        })
    }

    const likepost=()=>{
        const datas={
            name:det.username,
            email:det.useremail,
            like:true,
            postid:post._id
        }
        axios.post("/like/postlikes",datas).then((res)=>{
            toast.success("Like Added Successfuly !")
            checklike()
            viewlikes()
        })
    }

    const checklike=()=>{
        const datas={
            name:det.username,
            email:det.useremail,
            postid:post._id
        }
        axios.post("/like/checklikes",datas).then((res)=>{
            if(res.data.status){
                setLikes(true)
                setLikeId(res.data.likeid)
            }
            else{
                setLikes(false)
            }
            setTotalLikes(res.data.totallike)
            setLoading(false)
        })
    }

    const dislikepost=()=>{
        axios.delete(`/like/dislikes/${likeid}`).then((res)=>{
            toast.success("Like has been removed successfully !")
            checklike()
            viewlikes()
        })
    }

    const viewlikes=()=>{
        axios.get(`/like/getlikes/${post._id}`).then((res)=>{
            console.log(res.data)
            setLikedUsers(res.data.msg)
            setClickedLike(true)
        })
    }
    return(
        <div className="container-fluid" id="top">
            {loading?
                <div className="loading">
                    <HashLoader
                    size={100}
                    color="green"
                    />
                </div>
            :
            <div>
            <NavigationBar/>
            <br></br>
            <br></br>
            <div className="title_background">
            <br></br>
            <h1 id="home_title"><MdAddAPhoto/> Pics World</h1>
            <br></br>
            </div>
            <br></br>
            {(post.length==0)?<div><h3 className="no_pics">No Post Found</h3><br></br><div className="footer_button">
            <button className="btn btn-success" onClick={()=>navigate("/")}>Go Back</button></div></div>:<div>
            <div className="posts">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-4">
                            <img className="img-fluid" src={post.photo} width="450" height="300"/>
                        </div>
                        <div className='col-md-4'>
                            <br></br>
                            <p><span>Title : </span>{post.Title}</p>
                            <p><span>Category : </span>{post.Category}</p>
                            <p><span>Posted By : </span>{post.PostedBy}</p>
                            <p><span>Posted Date : </span>{post.PostedDate.substring(0,10)}</p>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <br></br>
            </div>
            <div className="row">
                <div className="col-md-3 mt-3"></div>
                <div className="col-md-3 mt-3">
                    {likes?
                    <button className="btn btn-primary" onClick={dislikepost}><GrDislike/> Remove Like</button>:
                    <button className="btn btn-success" onClick={likepost}><GrLike/> Like Post</button>
                    }
                </div>
                <div className="col-md-3 mt-3">
                    {clickedlike?
                    <button className="btn btn-secondary" onClick={()=>setClickedLike(false)}>Minimize Likes</button>
                    :<button className="btn btn-secondary" onClick={viewlikes}>View Likes</button>}
                </div>
            </div>
            <br></br>
            <br></br>
            <h3 id="liked_by">Post Liked By : {totallikes} members</h3>
            <br></br>
            {clickedlike?
            <div className="row likes">
                <h2 id="likes_title">Liked Users</h2>
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <hr></hr>
                    {likedusers.map((x)=><div>
                        <h4 id="likedusers">{x.Name}</h4>
                        <hr></hr>
                    </div>
                    )}
                </div>
            </div>
            :""}
            <br></br>
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8 desc_heading">
                    <h3>Description :</h3>
                    <hr></hr>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8 description">
                    <p> {post.Description}</p>
                    <hr></hr>
                </div>
            </div>
            <div className="comment_section">
                <div className="row">
                    <div className="col-md-2 "></div>
                    <div className="col-md-4 ">
                        <h3 id="comment_heading">Comments :</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 mt-3"></div>
                    <div className="col-md-5 mt-3">
                        <form>
                            <div className="form-group">
                                <input type="text" placeholder="Add your comments here" className="form-control" value={postcomment} onChange={(e)=>setPostComment(e.target.value)} required></input>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-3 mt-3">
                        <button className="btn btn-success" onClick={addcomment}>Post Comment</button>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <hr></hr>
                        {nocomments?<div><h3>No comments Found</h3></div>:
                        (comments.map((x)=><div>
                            <h4 id="comment_username">Name : {x.UserName}</h4>
                            <p id="comment_comments">Comment : {x.Comment}</p>
                            {(det.useremail===x.Email)?
                            <button onClick={()=>deletecomment(x._id)} className="btn btn-outline-success">Delete</button>
                            :""}   
                            <hr></hr>
                        </div>))}
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-md-5 mt-3"></div>
                <div className="col-md-1 mt-3">
                    <button className="btn btn-success" onClick={()=>{det.setViewDetails([]);navigate("/")}}>Go Back</button>
                </div>
                <div className="col-md-1 mt-3">
                    <button className="btn btn-success" onClick={()=>window.scrollTo({top:0,behaviour:'Smooth'})}>Go Top</button>
                </div>
            </div>
            <br></br>
        
            <div className="footer">
                <div className='container-fluid'>
                <br></br>
                <div className="about_pics">
                <h1>About Pics World</h1>
                </div>
                <br></br>
                <div className="line"></div>
                <br></br>
                <div className="row">
                <div className="about_pics_desc col-md-6">
                    <p>PicsWorld - A social media web appication which allows the users to upload their posts,comment the posts of others
                        and like the posts of others.It also allows the user to set their profile and add their bio in the profile page.
                    </p>
                    <br></br>
                </div>
                <div className='about_pics_desc col-md-6'>
                    <p>Please contact us if you have any questions or concerns about the content on PicsWorld <a href="mailto:picsworld@gmail.com">picsworld@gmail.com</a></p>
                </div>
                <br></br>
                </div>
                <div className="line"></div>
                <br></br>
                <p style={{textAlign:"center",color:"greenyellow"}}>CopyRight © 2023 PicsWorld.All Rights Reserved</p>
                </div>
                
            </div>
            
            <br></br>
            <ToastContainer/>
            </div>}
            </div>}
        </div>
    )
}