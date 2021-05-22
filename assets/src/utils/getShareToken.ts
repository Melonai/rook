export default (): string => {
    const splitPath = window.location.pathname.split("/");
    return splitPath[splitPath.length - 1];
};
