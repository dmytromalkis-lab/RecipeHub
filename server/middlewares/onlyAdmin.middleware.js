export default function onlyAdmin(req, res, next) {
    if(process.env.ADMIN_ON == true) {
        next();
    }
    else if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "You are not admin" });
    }

    next();
}
