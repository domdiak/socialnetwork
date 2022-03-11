export function ProfilePic({ url, first, last }) {
    return (
        <div id={"profile-pic"}>
            <img src={url} alt={`${first} ${last}`} />
        </div>
    );
}
