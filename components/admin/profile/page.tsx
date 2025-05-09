"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  about: string;
}

interface ProfileState {
  pt: ProfileData;
  en: ProfileData;
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do perfil",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [toast, isAuthenticated]);

  const handleChange = (
    lang: "pt" | "en",
    field: keyof ProfileData,
    value: string,
  ) => {
    if (!profile) return;

    setProfile({
      ...profile,
      [lang]: {
        ...profile[lang],
        [field]: value,
      },
    });

    // Limpar mensagens de sucesso/erro quando o usuário faz alterações
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSaveSuccess(true);
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
        });
      } else {
        const errorMessage =
          data.error || "Não foi possível atualizar o perfil";
        setSaveError(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setSaveError("Erro de conexão ao tentar salvar o perfil");
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Se não estiver autenticado, o AuthGuard já cuidará do redirecionamento
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <p>Não foi possível carregar os dados do perfil.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-8">Editar Perfil</h1>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Salvo com sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">
            Suas alterações foram salvas com sucesso. As alterações estarão
            visíveis na próxima vez que você carregar a página.
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro ao salvar</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="pt">
          <TabsList className="mb-6">
            <TabsTrigger value="pt">Português</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>

          <TabsContent value="pt">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais (Português)</CardTitle>
                <CardDescription>
                  Edite suas informações pessoais em português
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pt-name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <Input
                    id="pt-name"
                    value={profile.pt.name}
                    onChange={(e) => handleChange("pt", "name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="pt-title" className="text-sm font-medium">
                    Título Profissional
                  </label>
                  <Input
                    id="pt-title"
                    value={profile.pt.title}
                    onChange={(e) =>
                      handleChange("pt", "title", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="pt-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="pt-email"
                      type="email"
                      value={profile.pt.email}
                      onChange={(e) =>
                        handleChange("pt", "email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pt-phone" className="text-sm font-medium">
                      Telefone
                    </label>
                    <Input
                      id="pt-phone"
                      value={profile.pt.phone}
                      onChange={(e) =>
                        handleChange("pt", "phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="pt-location"
                      className="text-sm font-medium"
                    >
                      Localização
                    </label>
                    <Input
                      id="pt-location"
                      value={profile.pt.location}
                      onChange={(e) =>
                        handleChange("pt", "location", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="pt-birthDate"
                      className="text-sm font-medium"
                    >
                      Data de Nascimento
                    </label>
                    <Input
                      id="pt-birthDate"
                      value={profile.pt.birthDate}
                      onChange={(e) =>
                        handleChange("pt", "birthDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pt-about" className="text-sm font-medium">
                    Sobre Mim
                  </label>
                  <Textarea
                    id="pt-about"
                    value={profile.pt.about}
                    onChange={(e) =>
                      handleChange("pt", "about", e.target.value)
                    }
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="en">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information (English)</CardTitle>
                <CardDescription>
                  Edit your personal information in English
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="en-name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="en-name"
                    value={profile.en.name}
                    onChange={(e) => handleChange("en", "name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="en-title" className="text-sm font-medium">
                    Professional Title
                  </label>
                  <Input
                    id="en-title"
                    value={profile.en.title}
                    onChange={(e) =>
                      handleChange("en", "title", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="en-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="en-email"
                      type="email"
                      value={profile.en.email}
                      onChange={(e) =>
                        handleChange("en", "email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="en-phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="en-phone"
                      value={profile.en.phone}
                      onChange={(e) =>
                        handleChange("en", "phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="en-location"
                      className="text-sm font-medium"
                    >
                      Location
                    </label>
                    <Input
                      id="en-location"
                      value={profile.en.location}
                      onChange={(e) =>
                        handleChange("en", "location", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="en-birthDate"
                      className="text-sm font-medium"
                    >
                      Birth Date
                    </label>
                    <Input
                      id="en-birthDate"
                      value={profile.en.birthDate}
                      onChange={(e) =>
                        handleChange("en", "birthDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="en-about" className="text-sm font-medium">
                    About Me
                  </label>
                  <Textarea
                    id="en-about"
                    value={profile.en.about}
                    onChange={(e) =>
                      handleChange("en", "about", e.target.value)
                    }
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
