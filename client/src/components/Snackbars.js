import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Snackbars = ({ snackbarOpen, setSnackbarOpen }) => {
    return (
        <Snackbar open={snackbarOpen?.open} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3500} onClose={(event, reason) => {
                if (reason === "clickaway") { return; };
                setSnackbarOpen({ ...snackbarOpen, open: false })
            }}>
            <MuiAlert elevation={5} variant="filled"
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; setSnackbarOpen({ ...snackbarOpen, open: false }) }}
                severity={snackbarOpen?.severity}
            >
                {snackbarOpen.content}
            </MuiAlert>
        </Snackbar>
    )
}

export default Snackbars
