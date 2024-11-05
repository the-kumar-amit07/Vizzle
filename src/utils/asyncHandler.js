{/* Approach-One */}
const asyncHandler = (requestHandler) => {
    return (req,res,nxt) => {
        Promise.resolve(requestHandler(req,res,nxt))
                .catch((error)=> nxt(error))
    }
}
export { asyncHandler }


{/* Approach-Two
    const asyncHandler = (fn) => async (req, res, nxt) => {
    try {
        await fn(req,res,nxt)
    } catch (error) {
        res.status(error.code || 400).json({
            success: false,
            message: error.message
        }) 
    }
    }
*/}