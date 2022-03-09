import { Registration } from "./registration";

// export everyting without default and use curly brackets or just rely on export default and then incclude it in import
export default function Welcome() {
    return (
        <>
            <h1> Welcome</h1>
            <Registration />
        </>
    );
}
