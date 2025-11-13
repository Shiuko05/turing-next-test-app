import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#1e293b] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ee7b7] focus:border-transparent outline-none transition"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ee7b7] focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <a 
                  href="#" 
                  className="text-sm text-[#1e293b] hover:text-[#6ee7b7] transition"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#6ee7b7] text-[#1e293b] font-semibold py-3 px-4 rounded-lg hover:bg-[#5dd6a6] transition duration-200 shadow-md hover:shadow-lg"
              >
                Ingresar
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <a 
                  href="/signup" 
                  className="text-[#1e293b] font-semibold hover:text-[#6ee7b7] transition"
                >
                  Regístrate
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
