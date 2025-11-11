'use client'

import { useRef, useState } from 'react'

import { Chip, Divider, Typography, Alert, Grid } from '@mui/material'

import { ESTADO_CIVIL_NOME, NACIONALIDADE_NOME } from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'

import ModalUpdatePerfil from './ModalUpdatePerfil'
import { AvatarCustomized } from '@/components/ui/AvatarCustomized'
import { fileToUrl } from '@/utils/file'
import { FotoPerfilService } from '@/services/FotoPerfilService'
import { useProfile } from '@/contexts/ProfileContext'
import TextWithLegend from '@/components/ui/TextWithLegend'
import type { DadosParticipanteProps } from '@/types/perfil/perfil'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { useAuth } from '@/contexts/AuthContext'
import { Projecao } from './Projecao'

function TitleWithDivider({ title }: { title: string }) {
  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='h5'>{title}</Typography>
      <Divider />
    </div>
  )
}

export function DadosParticipante({ participanteId, participante, onUpdate, showToast }: DadosParticipanteProps) {
  const [openModal, setOpenModal] = useState(false)
  const { profile, setProfile } = useProfile()
  const { user } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetInputField = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateFile = (file: globalThis.File) => {
    if (file.size > 3 * 1024 * 1024) {
      resetInputField()
      showToast('A foto de perfil deve ter no máximo 3MB', 'warning')

      return false
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      resetInputField()
      showToast('Tipo de arquivo inválido', 'warning')

      return false
    }

    return true
  }

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFotoPerfil = e.target.files[0]

      if (!validateFile(newFotoPerfil)) return

      const formData = new FormData()

      formData.append('avatar', newFotoPerfil)
      await FotoPerfilService.salvarFotoPerfil(participanteId, formData)
      onUpdate()
      setProfile({
        ...profile,
        fotoPerfil: fileToUrl(newFotoPerfil)
      })
      showToast('Foto de perfil atualizada com sucesso', 'success')
      resetInputField()
    }
  }

  // Early return if participante is not available
  if (!participante) {
    return null
  }

  return (
    <>
      <CardCustomized.Root>
        <CardCustomized.Content className='flex flex-col gap-4'>
          <div className='flex flex-wrap lg:flex-nowrap items-end lg:items-start mb-2 gap-4'>
            <div className='flex flex-col items-center justify-center relative'>
              <div className='group w-[150px] max-w-[150px] cursor-pointer relative overflow-hidden rounded-2xl'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/png, image/jpeg, image/jpg'
                  name='fotoPerfil'
                  style={{ display: 'none' }}
                  onChange={handleProfileImageChange}
                />
                <div className={`w-[150px] h-[150px] group-hover:blur-sm`}>
                  <AvatarCustomized alt={participante.nome} src={participante?.fotoPerfil || ''} />
                </div>
                <div
                  className='hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/50 items-center justify-center cursor-pointer'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className='flex flex-col items-center justify-center font-medium text-white text-center'>
                    <i className='fa-regular fa-camera text-2xl'></i>
                    <Typography variant='body1' color='white' fontWeight={500}>
                      {participante.fotoPerfil ? 'Trocar foto' : 'Enviar foto'}
                      <br />
                      <small>(até 3MB)</small>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-start justify-end gap-1 sm:px-6 px-0'>
              <Chip variant='tonal' color='primary' label='Participante'></Chip>

              <Typography variant='h4' fontWeight={700}>
                {participante.nome}
              </Typography>

              <Projecao participanteId={participanteId} />
            </div>
          </div>

          <TitleWithDivider title='DADOS PESSOAIS' />

          <Grid container spacing={{ xs: 4, md: 6 }} columns={{ xs: 12, md: 15 }}>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend legend='Data de nascimento' text={participante.dataNascimento} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend legend='Sexo' text={participante.sexo} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend legend='Estado civil' text={ESTADO_CIVIL_NOME[participante.estadoCivil] || 'OUTROS'} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend
                legend='Nacionalidade'
                text={NACIONALIDADE_NOME[participante.nacionalidade] || 'NÃO INFORMADA'}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend
                legend='Naturalidade'
                text={`${participante.naturalidade}/${participante.ufNaturalidade}`}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend legend='RG' text={participante.rg} />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <TextWithLegend legend='Órgão expedidor do RG' text={`${participante.emissorRg}/${participante.ufRg}`} />
            </Grid>
            <Grid item xs={6}>
              <TextWithLegend legend='Data de expedição' text={participante.dataExpedicao} />
            </Grid>
            <Grid item sm={12} md={6}>
              <TextWithLegend legend='Nome da mãe' text={participante.nomeMae} />
            </Grid>
            <Grid item sm={12} md={7}>
              <TextWithLegend legend='Nome do pai' text={participante.nomePai} />
            </Grid>
          </Grid>

          <TitleWithDivider title='ENDEREÇO' />
          <Grid container spacing={{ xs: 4, md: 6 }} columns={{ xs: 12, md: 15 }}>
            <Grid item xs={6} sm={3}>
              <TextWithLegend legend='CEP' text={participante.cep} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextWithLegend legend='UF' text={participante.uf} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextWithLegend legend='Cidade' text={participante.cidade} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextWithLegend legend='Bairro' text={participante.bairro} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextWithLegend legend='Número' text={participante.numero} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextWithLegend legend='Logradouro' text={participante.logradouro} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextWithLegend legend='Complemento' text={participante.complemento || ''} />
            </Grid>
          </Grid>

          <TitleWithDivider title='CONTATO' />

          <Grid container spacing={{ xs: 4, md: 6 }} columns={{ xs: 12, md: 15 }}>
            <Grid item xs={12}>
              <TextWithLegend legend='E-mail principal' text={participante.emailPrincipal} />
            </Grid>
            {participante.emailAlternativo1 && (
              <Grid item xs={12}>
                <TextWithLegend legend='E-mail alternativo' text={participante.emailAlternativo1} />
              </Grid>
            )}
            {participante.emailAlternativo2 && (
              <Grid item xs={12}>
                <TextWithLegend legend='E-mail alternativo' text={participante.emailAlternativo2} />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextWithLegend legend='Telefone residencial' text={participante.telefoneResidencial} />
            </Grid>
            <Grid item xs={6}>
              <TextWithLegend legend='Celular' text={participante.telefoneCelular} />
            </Grid>
          </Grid>

          <div className='flex flex-col mt-2'>
            {user?.viewerMode ? (
              <div>
                <ButtonCustomized
                  fullWidth
                  variant='outlined'
                  type='button'
                  className='max-w-[250px]'
                  disabled
                  sx={{ opacity: 0.6 }}
                >
                  <i className='material-symbols mr-2'>edit</i> Editar informações
                </ButtonCustomized>
                <Alert severity='info' sx={{ mt: 1, fontSize: '12px' }}>
                  A edição de informações está desabilitada no modo consulta
                </Alert>
              </div>
            ) : (
              <ButtonCustomized
                fullWidth
                variant='outlined'
                type='button'
                className='max-w-[250px]'
                onClick={() => setOpenModal(true)}
              >
                <i className='material-symbols mr-2'>edit</i> Editar informações
              </ButtonCustomized>
            )}
          </div>
        </CardCustomized.Content>
      </CardCustomized.Root>

      <ModalUpdatePerfil
        participanteId={participanteId}
        openModal={openModal}
        setOpenModal={setOpenModal}
        participante={participante}
        onUpdate={onUpdate}
        showToast={showToast}
      />
    </>
  )
}
