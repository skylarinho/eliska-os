import { useState, type FC, type FormEvent } from 'react'
import { Plus, Volume2, VolumeX } from 'lucide-react'
import { BottomSheet } from '@/components/arc/bottom-sheet/bottom-sheet'
import { Button } from '@/components/arc/button/button'
import { getVocativeName, useProfileStore } from '../store/useProfileStore'

interface ProfilSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const pole =
  'min-h-14 w-full rounded-s border-2 border-inkoust-3 bg-papir px-3.5 text-[17px] text-inkoust focus:border-inkoust focus:outline-none'

export const ProfilSheet: FC<ProfilSheetProps> = ({ open, onOpenChange }) => {
  const { profiles, activeProfileId, setActiveProfileId, createProfile, soundEnabled, toggleSound } =
    useProfileStore()
  const resetPostupu = useProfileStore((s) => s.resetActiveProfileProgress)
  const [pridava, setPridava] = useState(false)
  const [jmeno, setJmeno] = useState('')
  const [osloveni, setOsloveni] = useState('')
  const [potvrzeniResetu, setPotvrzeniResetu] = useState(false)

  const zavrit = (otevreno: boolean) => {
    onOpenChange(otevreno)
    if (!otevreno) {
      setPridava(false)
      setPotvrzeniResetu(false)
    }
  }

  const vybrat = (id: string) => {
    setActiveProfileId(id)
    zavrit(false)
  }

  const ulozit = (e: FormEvent) => {
    e.preventDefault()
    if (!jmeno.trim()) return
    const id = createProfile({ name: jmeno, avatar: 'vombat' })
    useProfileStore.getState().updateProfile(id, { vokativ: osloveni.trim() || getVocativeName(jmeno) })
    setJmeno('')
    setOsloveni('')
    zavrit(false)
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={zavrit}
      title="Kdo se dnes učí?"
      detents={[0.62, 0.92]}
      closeLabel="Zavřít"
    >
      {!pridava ? (
        <div className="pt-1">
          {profiles.map((p) => {
            const vybrany = p.id === activeProfileId
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={vybrany}
                autoFocus={vybrany}
                onClick={() => vybrat(p.id)}
                className={`mb-2 flex min-h-[60px] w-full items-center gap-3 rounded-s border-2 bg-papir px-3 py-2.5 text-left font-semibold ${
                  vybrany ? 'border-inkoust' : 'border-inkoust-3'
                }`}
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-inkoust">
                  {p.name.trim()[0]?.toLocaleUpperCase('cs')}
                </span>
                {p.name}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setPridava(true)}
            className="mb-5 flex min-h-[60px] w-full items-center gap-3 rounded-s border-2 border-dashed border-inkoust-3 bg-papir px-3 py-2.5 text-left text-inkoust-2"
          >
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-inkoust-3">
              <Plus className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            Přidat profil
          </button>

          <div className="flex flex-col gap-2 border-t-2 border-linka pt-4">
            <Button variant="secondary" size="lg" onClick={toggleSound} aria-pressed={soundEnabled}>
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              ) : (
                <VolumeX className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              )}
              {soundEnabled ? 'Zvuk je zapnutý' : 'Zvuk je vypnutý'}
            </Button>
            {potvrzeniResetu ? (
              <Button
                variant="danger"
                size="lg"
                onClick={() => {
                  resetPostupu()
                  zavrit(false)
                }}
              >
                Opravdu smazat hvězdy a sérii?
              </Button>
            ) : (
              <Button variant="ghost" size="lg" onClick={() => setPotvrzeniResetu(true)}>
                Smazat postup tohoto profilu
              </Button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={ulozit} className="flex flex-col gap-4 pt-1">
          <label className="block text-[15px] text-inkoust-2">
            Jméno
            <input
              className={`${pole} mt-1`}
              value={jmeno}
              onChange={(e) => {
                setJmeno(e.target.value)
                setOsloveni(getVocativeName(e.target.value))
              }}
              autoComplete="off"
              required
            />
          </label>
          <label className="block text-[15px] text-inkoust-2">
            Oslovení (5. pád, například Eliško)
            <input
              className={`${pole} mt-1`}
              value={osloveni}
              onChange={(e) => setOsloveni(e.target.value)}
              autoComplete="off"
            />
          </label>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setPridava(false)}>
              Zpět
            </Button>
            <Button type="submit" size="lg" className="flex-1">
              Uložit
            </Button>
          </div>
        </form>
      )}
    </BottomSheet>
  )
}
