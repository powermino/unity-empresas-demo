import { Smartphone, Cable, RadioTower, Cpu } from 'lucide-react'

const map = { Smartphone, Cable, RadioTower, Cpu }

export default function Icon({ name, ...props }) {
  const C = map[name] || Smartphone
  return <C aria-hidden="true" {...props} />
}
