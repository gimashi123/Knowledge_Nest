import ProgressList from "./components/progress/ProgressList.tsx";
import './components/progress/Progress.css'
import './App.css'

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Knowledge Nest</h1>
                <p>Track your learning progress</p>
            </header>

            <main className="app-main">
                <ProgressList />
            </main>

            <footer className="app-footer">
                <p>&copy; 2023 Knowledge Nest - Learning Tracker</p>
            </footer>
        </div>
    )
}

export default App
