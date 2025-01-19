import TextField from '@material-ui/TextField';

export const SearchBox = () => {
    return (
        <div>
            <h3>Search you city</h3>
            <form>
            <TextField id="city" label="City Name" variant="standard" />
            </form>
        </div>
    )
}