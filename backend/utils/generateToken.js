import jwt from "jsonwebtoken"
const generateToken = (userId,res) => {
const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn : "15d"
});
res.cookie("jwt",token,{
    httpOnly : true,
    maxAge : 15*24*60*1000,
    sameSite : "strict",//it shows that it is same origin right not cross origin
    secure : process.env.NODE_ENV !== "development"
})
}
export default generateToken;//If your website gives the cookie to the browser, the browser will only send it back when your own website asks for it — not when another site tries to trick it.