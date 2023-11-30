export default function Register() {
    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h1 className="text-xl font-bold text-center mb-6">Register to Slapscape</h1>
                <form action="/api/register" method="POST">
                    <div className="mb-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="User name"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="confirmEmail"
                            placeholder="Confirm Email"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-white input-shadow focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white p-4 rounded-xl button-shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?
                    <a href="/login" className="text-purple-600 hover:text-purple-800"> Login here</a>
                </p>
            </div>
        </div>
    );
}
