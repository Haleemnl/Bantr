import "../globals.css";



export default function Layout({ children }) {


    return (

        <main className="flex-1">

            {children}
        </main>



    );
}