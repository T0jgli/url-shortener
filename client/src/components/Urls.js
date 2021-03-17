import { Button, CircularProgress, IconButton } from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import { useState } from "react";
const BACKEND_URL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_URL : ""

const Urls = ({ longUrl, shortUrl, setSnackbarOpen, setResponseData, responseData, view }) => {
    const urlCode = shortUrl.split("/").slice(-1)[0]
    const [loading, setLoading] = useState(false)

    const removeUrl = () => {
        setLoading(true)
        axios.delete(BACKEND_URL + `/api/${urlCode}`).then(res => {
            const newDataArray = responseData.filter(url => url.shortUrl !== shortUrl)
            setResponseData(newDataArray)
            setLoading(false)
            localStorage.setItem("URLS", JSON.stringify(newDataArray))
            if (res.data.errorMessage) return setSnackbarOpen({
                open: true,
                content: res.data.errorMessage,
                severity: "error",
            })

            if (res.status === 200) {
                return setSnackbarOpen({
                    open: true,
                    content: "Sikeresen eltávolítva",
                    severity: "info",
                })
            }
        })
    }

    if (process.env.NODE_ENV === "development") {

    }

    return (
        <div className="my-urls">
            <IconButton aria-label="Törlés ikon" disabled={loading} onClick={removeUrl} size="small" className="delete-icon">
                {loading ? (
                    <CircularProgress aria-hidden={true} size={20} style={{ color: "white" }} />
                ) : (
                    <CloseIcon aria-hidden={true} />
                )}
            </IconButton>
            {view && (
                <div aria-label="Hányan nézték meg ikon" className="count-icon">
                    {view[urlCode]}
                </div>
            )}

            <ul>
                <li>
                    <span title={longUrl} className="longurl">{longUrl}</span>
                    <span className="shorturl">
                        <a target="_blank" rel="noreferrer"
                            href={process.env.NODE_ENV === "development" ? (process.env.REACT_APP_URL + "/" + shortUrl.split("/").slice(-1)[0]) : shortUrl}>
                            {process.env.NODE_ENV === "development" ? (process.env.REACT_APP_URL + "/" + shortUrl.split("/").slice(-1)[0]) : shortUrl}
                        </a>
                        <Button onClick={() => {
                            navigator.clipboard.writeText(shortUrl)
                            setSnackbarOpen({
                                open: true,
                                content: "URL másolva a vágólapra",
                                severity: "info",
                            })
                        }} style={{ cursor: "pointer" }}>
                            Másolás
                        </Button>

                    </span>
                </li>
            </ul>
        </div>
    )
}

export default Urls
