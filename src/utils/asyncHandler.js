{/* Approach-One */}
const asyncHandler = () => {
    (req,res,nxt) => {
        Promise.resolve(asyncHandler(req,res,nxt))
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