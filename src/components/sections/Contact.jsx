import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { site, whatsappLink } from '../../config/site'
import WhatsAppIcon from '../ui/WhatsAppIcon'

const subjects = ['Soluções para minha empresa', 'Quero ser parceiro', 'Trabalhe conosco', 'Outro assunto']

function Field({ label, id, as = 'input', ...props }) {
  const C = as
  return (
    <label htmlFor={id} className="group block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-white/50">{label}</span>
      <C
        id={id}
        name={id}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 transition-colors focus:border-electric focus:bg-white/[0.07] focus:outline-none"
        {...props}
      />
    </label>
  )
}

export default function Contact() {
  const hasEndpoint = Boolean(site.formEndpoint)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('_gotcha')) return // honeypot anti-spam

    if (!hasEndpoint) {
      // Sem endpoint configurado: a mensagem segue pelo WhatsApp oficial.
      const text = [
        'Olá, vim pelo site e gostaria de atendimento.',
        `Nome: ${data.get('nome')}`,
        data.get('empresa') && `Empresa: ${data.get('empresa')}`,
        `Telefone: ${data.get('telefone')}`,
        data.get('email') && `E-mail: ${data.get('email')}`,
        `Assunto: ${data.get('assunto')}`,
        data.get('mensagem') && `Mensagem: ${data.get('mensagem')}`,
      ]
        .filter(Boolean)
        .join('\n')
      window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(site.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('ok')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contato" aria-labelledby="contato-title" className="relative bg-mist-50 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[36px] bg-navy-950 py-20 text-white sm:py-28">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -left-40 bottom-[-30%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(31,107,255,.35),transparent_60%)]" />
          <div className="absolute inset-0 grid-lines-dark [mask-image:radial-gradient(ellipse_at_80%_20%,#000,transparent_60%)]" />
        </div>

        <div className="container-site relative grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow text-electric-300">Fale com um especialista</p>
            <h2 id="contato-title" data-reveal className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
              Vamos conectar a <span className="text-gradient">sua empresa?</span>
            </h2>
            <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
              Conte o que sua operação precisa. Um consultor Unity analisa seus custos e indica a melhor solução TIM
              Empresas.
            </p>

            <a data-reveal href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn mt-10 bg-[#25D366] text-navy-950 hover:-translate-y-0.5 hover:bg-[#3be07a]">
              <WhatsAppIcon className="h-5 w-5" /> Chamar no WhatsApp
            </a>

            <ul className="mt-12 space-y-5 border-t border-white/10 pt-10 text-sm">
              <li data-reveal>
                <a href={site.contact.phoneHref} className="flex items-center gap-4 text-white/80 hover:text-white">
                  <Phone className="h-4 w-4 text-electric-300" aria-hidden="true" /> {site.contact.phoneDisplay}
                </a>
              </li>
              <li data-reveal>
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-4 text-white/80 hover:text-white">
                  <Mail className="h-4 w-4 text-electric-300" aria-hidden="true" /> {site.contact.email}
                </a>
              </li>
              <li data-reveal className="flex items-start gap-4 text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-300" aria-hidden="true" /> {site.contact.address}
              </li>
            </ul>
          </div>

          <form data-reveal onSubmit={onSubmit} className="glass-card p-6 sm:p-10 lg:col-span-7" noValidate={false}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome" id="nome" required autoComplete="name" placeholder="Seu nome" />
              <Field label="Empresa" id="empresa" autoComplete="organization" placeholder="Nome da empresa" />
              <Field label="Telefone" id="telefone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" />
              <Field label="E-mail" id="email" type="email" autoComplete="email" placeholder="voce@empresa.com.br" />
            </div>
            <div className="mt-5">
              <Field label="Assunto" id="assunto" as="select" defaultValue={subjects[0]}>
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-navy-900">
                    {s}
                  </option>
                ))}
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Mensagem" id="mensagem" as="textarea" rows={4} placeholder="Como podemos ajudar?" />
            </div>
            {hasEndpoint && (
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-white/50">Anexo (opcional, ex.: currículo)</span>
                <input type="file" name="anexo" accept=".pdf,.doc,.docx" className="block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white" />
              </label>
            )}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-white/40">
                {hasEndpoint
                  ? 'Seus dados são usados apenas para retornarmos o contato.'
                  : 'Ao enviar, sua mensagem é aberta no WhatsApp oficial da Unity. Seus dados são usados apenas para retorno.'}
              </p>
              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                {status === 'sending' ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : hasEndpoint ? (
                  <Send className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <WhatsAppIcon className="h-4 w-4" />
                )}
                {hasEndpoint ? 'Enviar mensagem' : 'Enviar pelo WhatsApp'}
              </button>
            </div>

            <div aria-live="polite" className="mt-4 text-sm">
              {status === 'ok' && (
                <p className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Mensagem enviada. Em breve um especialista entra em contato.
                </p>
              )}
              {status === 'error' && (
                <p className="flex items-center gap-2 text-rose-300">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" /> Não foi possível enviar agora. Tente pelo WhatsApp.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
