import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiClock, FiActivity, FiServer, FiDatabase, FiGlobe, FiRefreshCw, FiMail } from "react-icons/fi";

export default function StatusPage() {
  const services = [
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.98%",
      responseTime: "45ms",
      lastIncident: "None in the last 90 days",
      description: "Main web application and user interface"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      responseTime: "8ms",
      lastIncident: "None in the last 90 days",
      description: "Primary database and data storage"
    },
    {
      name: "File Storage",
      status: "operational",
      uptime: "99.97%",
      responseTime: "120ms",
      lastIncident: "None in the last 90 days",
      description: "File upload and storage services"
    },
    {
      name: "Search Engine",
      status: "operational",
      uptime: "99.96%",
      responseTime: "85ms",
      lastIncident: "None in the last 90 days",
      description: "Search and indexing"
    },
    {
      name: "Email Services",
      status: "operational",
      uptime: "99.95%",
      responseTime: "200ms",
      lastIncident: "None in the last 90 days",
      description: "Email notifications and delivery"
    }
  ];

  const regions = [
    { name: "North America", status: "operational", latency: "5ms" },
    { name: "Europe", status: "operational", latency: "45ms" },
    { name: "Asia Pacific", status: "operational", latency: "120ms" },
    { name: "South America", status: "operational", latency: "80ms" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'outage':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'degraded':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'outage':
        return <FiXCircle className="w-5 h-5" />;
      default:
        return <FiClock className="w-5 h-5" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 border-yellow-200';
      case 'outage':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <FiActivity className="w-4 h-4 text-green-400 mr-2" />
                All systems operational
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                System <span className="gradient-text">Status</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Real-time status of SnippifyX services. We're committed to providing reliable, 
                high-performance service to our users.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500" />
                  <span>All services operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiRefreshCw className="w-4 h-4 text-blue-500" />
                  <span>Updated 2 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overall Status */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group relative text-center p-8 rounded-2xl bg-green-50 border border-green-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <FiCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Overall Status</h3>
                    <p className="text-green-600 font-medium">All Systems Operational</p>
                  </div>
                </div>
                
                <div className="group relative text-center p-8 rounded-2xl bg-blue-50 border border-blue-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <FiServer className="w-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Uptime</h3>
                    <p className="text-blue-600 font-medium">99.98% (Last 30 days)</p>
                  </div>
                </div>
                
                <div className="group relative text-center p-8 rounded-2xl bg-purple-50 border border-purple-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <FiGlobe className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Response Time</h3>
                    <p className="text-purple-600 font-medium">45ms (Average)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Service Status
                </h2>
                <p className="text-xl text-muted-foreground">
                  Detailed status of all SnippifyX services
                </p>
              </div>
              
              <div className="space-y-6">
                {services.map((service, index) => (
                  <div key={index} className={`group relative p-6 rounded-2xl bg-gray-50 border ${getStatusBg(service.status)} hover:shadow-lg transition-all duration-500 hover:-translate-y-1`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 ${getStatusColor(service.status)} group-hover:scale-110 transition-transform duration-500`}>
                            {getStatusIcon(service.status)}
                            <span className="font-medium">{service.status}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="grid grid-cols-3 gap-6 text-sm">
                            <div>
                              <p className="text-muted-foreground">Uptime</p>
                              <p className="font-medium">{service.uptime}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Response</p>
                              <p className="font-medium">{service.responseTime}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Incident</p>
                              <p className="font-medium text-xs">{service.lastIncident}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Regional Status */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Regional Performance
                </h2>
                <p className="text-xl text-muted-foreground">
                  Response times across different regions
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {regions.map((region, index) => (
                  <div key={index} className="group relative p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-2 ${getStatusColor(region.status)} group-hover:scale-110 transition-transform duration-500`}>
                            {getStatusIcon(region.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{region.name}</h3>
                            <p className="text-sm text-muted-foreground">Latency: {region.latency}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(region.status)} bg-opacity-10`}>
                          {region.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Incident History */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Incident History
                </h2>
                <p className="text-xl text-muted-foreground">
                  Recent incidents and their resolutions
                </p>
              </div>
              
              <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center py-12">
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Recent Incidents</h3>
                  <p className="text-muted-foreground">
                    All services have been operating normally for the past 90 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Stay Informed
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Get notified about service updates, maintenance windows, and incident reports.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button size="lg" variant="secondary" className="btn-animate hover-lift">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">
                We'll only send you important service updates. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

        
      </div>
    </MarketingLayout>
  );
} 