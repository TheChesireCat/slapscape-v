export default function Login({message}) {
    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h1 className="text-xl font-bold text-center mb-6">Login to Slapscape</h1>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}
                <form action="/api/login" method="POST">
                    <div className="mb-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Password"
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white p-4 rounded-xl button-shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?
                    <a href="/register" className="text-purple-500"> Register here</a>
                </p>
            </div>
        </div>
    );
}
