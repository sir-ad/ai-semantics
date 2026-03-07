class Grain < Formula
  desc "The Universal Interaction Layer for AI Interfaces"
  homepage "https://grain.dev"
  url "https://github.com/sir-ad/grain/archive/refs/tags/v1.0.0-alpha.1.tar.gz"
  sha256 "REPLACE_WITH_ACTUAL_SHA256"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/grain", "--version"
  end
end
